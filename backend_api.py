#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VibeGuide Backend API Server
基于Flask的AI服务后端API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import json
import os
from typing import Dict, List, Any
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 初始化DeepSeek客户端
try:
    client = OpenAI(
        api_key="sk-c8646a8e5d3544afbddab39c423eb5fd", 
        base_url="https://api.deepseek.com"
    )
    logger.info("DeepSeek client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize DeepSeek client: {e}")
    # 创建一个空的客户端，运行时再处理
    client = None

class AIService:
    """AI服务类，封装与DeepSeek API的交互"""
    
    @staticmethod
    def generate_questions(project_description: str) -> Dict[str, Any]:
        """根据项目描述生成分析问题"""
        
        system_prompt = """你是一位专业的产品分析师。根据用户提供的项目描述，生成3-5个有针对性的问题来深入了解项目需求。

要求：
1. 问题要具体且有助于完善需求
2. 涵盖用户群体、功能特性、技术要求等方面
3. 返回JSON格式，包含questions数组和analysis字段
4. 每个问题包含id、question、type(text/multiple_choice/rating)、required字段
5. 如果是选择题，包含options数组

JSON格式示例：
{
    "questions": [
        {
            "id": "1",
            "question": "您的目标用户群体是谁？",
            "type": "text",
            "required": true
        },
        {
            "id": "2", 
            "question": "项目规模如何？",
            "type": "multiple_choice",
            "options": ["小型个人项目", "中型团队项目", "大型企业项目"],
            "required": true
        }
    ],
    "analysis": "基于您的项目描述分析..."
}"""

        user_prompt = f"项目描述：{project_description}\n\n请生成针对性的分析问题："

        try:
            if client is None:
                raise Exception("DeepSeek client not initialized")
                
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )
            
            # 解析AI返回的JSON
            ai_response = response.choices[0].message.content
            logger.info(f"AI Response: {ai_response}")
            
            # 尝试解析JSON
            try:
                if ai_response:
                    result = json.loads(ai_response)
                    return result
                else:
                    raise json.JSONDecodeError("AI response is empty", "", 0)
            except json.JSONDecodeError:
                # 如果AI没有返回有效JSON，提供默认问题
                return {
                    "questions": [
                        {
                            "id": "1",
                            "question": "您的目标用户群体是谁？请详细描述用户特征。",
                            "type": "text",
                            "required": True
                        },
                        {
                            "id": "2",
                            "question": "您希望这个项目解决什么核心问题？",
                            "type": "text", 
                            "required": True
                        },
                        {
                            "id": "3",
                            "question": "您预期的项目规模是？",
                            "type": "multiple_choice",
                            "options": ["小型个人项目", "中型团队项目", "大型企业项目"],
                            "required": True
                        }
                    ],
                    "analysis": f"基于您的项目描述\"{project_description[:50]}...\"，AI分析认为以下问题对于完善项目需求最为重要。"
                }
                
        except Exception as e:
            logger.error(f"Error generating questions: {e}")
            raise

    @staticmethod
    def analyze_answers(project_description: str, questions_answers: List[Dict]) -> str:
        """分析用户回答，生成需求分析"""
        
        system_prompt = """你是一位专业的产品分析师。基于用户的项目描述和问题回答，生成一份详细的需求分析报告。

报告应包含：
1. 项目概述
2. 核心需求分析
3. 用户画像
4. 功能建议
5. 技术建议
6. 实施建议

请用markdown格式输出，内容要专业、具体、有指导意义。"""

        # 构建问答内容
        qa_content = "\n".join([
            f"问题：{qa['question']}\n回答：{qa['answer']}\n"
            for qa in questions_answers
        ])

        user_prompt = f"""项目描述：{project_description}

问答内容：
{qa_content}

请生成详细的需求分析报告："""

        try:
            if client is None:
                raise Exception("DeepSeek client not initialized")
                
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            return content if content is not None else ""
            
        except Exception as e:
            logger.error(f"Error analyzing answers: {e}")
            raise

    @staticmethod
    def generate_document(doc_type: str, project_description: str, requirements: str) -> str:
        """生成特定类型的项目文档"""
        
        prompts = {
            "userJourney": """你是一位专业的用户体验设计师。基于项目描述和需求分析，生成详细的用户旅程图。

包含：
1. 用户角色定义
2. 关键使用场景
3. 用户操作流程
4. 触点分析
5. 痛点识别
6. 优化建议

请用markdown格式输出。""",

            "prd": """你是一位专业的产品经理。基于项目描述和需求分析，生成详细的产品需求文档(PRD)。

包含：
1. 产品概述
2. 需求背景
3. 用户群体
4. 核心功能
5. 非功能性需求
6. 约束条件
7. 验收标准

请用markdown格式输出。""",

            "frontendDesign": """你是一位专业的前端架构师。基于项目描述和需求分析，生成前端技术设计方案。

包含：
1. 技术栈选择
2. 架构设计
3. 模块划分
4. 状态管理
5. 路由设计
6. 样式方案
7. 性能优化

请用markdown格式输出。""",

            "backendDesign": """你是一位专业的后端架构师。基于项目描述和需求分析，生成后端技术设计方案。

包含：
1. 技术栈选择
2. 系统架构
3. API设计
4. 数据流设计
5. 安全考虑
6. 性能优化
7. 部署方案

请用markdown格式输出。""",

            "databaseDesign": """你是一位专业的数据库设计师。基于项目描述和需求分析，生成数据库设计方案。

包含：
1. 数据库选型
2. 数据模型设计
3. 表结构设计
4. 索引设计
5. 数据关系
6. 性能优化
7. 备份策略

请用markdown格式输出。"""
        }

        system_prompt = prompts.get(doc_type, prompts["prd"])
        user_prompt = f"""项目描述：{project_description}

需求分析：{requirements}

请生成相应的技术文档："""

        try:
            if client is None:
                raise Exception("DeepSeek client not initialized")
                
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            return content if content is not None else ""
            
        except Exception as e:
            logger.error(f"Error generating document: {e}")
            raise

# API路由定义
@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        "status": "healthy",
        "service": "VibeGuide AI API",
        "version": "1.0.0"
    })

@app.route('/api/ai/generate-questions', methods=['POST'])
def generate_questions():
    """生成分析问题接口"""
    try:
        data = request.get_json()
        project_description = data.get('projectDescription', '')
        
        if not project_description:
            return jsonify({
                "success": False,
                "error": "项目描述不能为空"
            }), 400
        
        result = AIService.generate_questions(project_description)
        
        return jsonify({
            "success": True,
            "data": result
        })
        
    except Exception as e:
        logger.error(f"Error in generate_questions: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/analyze-answers', methods=['POST'])
def analyze_answers():
    """分析回答接口"""
    try:
        data = request.get_json()
        project_description = data.get('projectDescription', '')
        questions = data.get('questions', [])
        
        if not project_description or not questions:
            return jsonify({
                "success": False,
                "error": "项目描述和问题回答不能为空"
            }), 400
        
        analysis = AIService.analyze_answers(project_description, questions)
        
        return jsonify({
            "success": True,
            "data": {
                "analysis": analysis
            }
        })
        
    except Exception as e:
        logger.error(f"Error in analyze_answers: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/generate-document', methods=['POST'])
def generate_document():
    """生成文档接口"""
    try:
        data = request.get_json()
        doc_type = data.get('type', '')
        project_description = data.get('projectDescription', '')
        requirements = data.get('requirements', '')
        
        if not all([doc_type, project_description, requirements]):
            return jsonify({
                "success": False,
                "error": "文档类型、项目描述和需求分析不能为空"
            }), 400
        
        document = AIService.generate_document(doc_type, project_description, requirements)
        
        return jsonify({
            "success": True,
            "data": {
                "content": document
            }
        })
        
    except Exception as e:
        logger.error(f"Error in generate_document: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)