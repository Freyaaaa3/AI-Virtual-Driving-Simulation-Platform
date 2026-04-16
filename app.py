from flask import Flask, render_template, request, jsonify
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Ollama API配置
OLLAMA_API_URL = os.getenv('OLLAMA_API_URL', 'http://localhost:11434/api/generate')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'deepseek-r1:7b')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_response():
    try:
        data = request.json
        
        # 提取用户画像和情景信息
        user_profile = data.get('user_profile', {})
        scenario = data.get('scenario', {})
        user_document = data.get('user_document', '')
        ai_response = data.get('ai_response', '')
        
        # 构建提示词
        prompt = build_prompt(user_profile, scenario, user_document, ai_response)
        
        # 调用Ollama API
        response = call_ollama(prompt)
        
        # 解析响应
        result = parse_response(response)
        
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def build_prompt(user_profile, scenario, user_document, ai_response):
    """构建发送给大模型的提示词"""
    ai_response_section = ""
    if ai_response:
        ai_response_section = f"""
AI场景响应语句（请参考此响应风格和内容）：
{ai_response}
"""
    
    prompt = f"""你要进行角色扮演，扮演的角色是一个驾驶员，请根据以下性格特征和驾驶情景给出自己的反应。

用户画像：
- 姓名：{user_profile.get('name', '未知')}
- 年龄：{user_profile.get('age', '未知')}
- 职业：{user_profile.get('occupation', '未知')}
- 驾驶年龄：{user_profile.get('driving_years', '未知')}年
- 性格特征：
  * 宜人性：{user_profile.get('agreeableness', 0)}/10
  * 尽责性：{user_profile.get('conscientiousness', 0)}/10
  * 神经质：{user_profile.get('neuroticism', 0)}/10
  * 开放性：{user_profile.get('openness', 0)}/10
  * 外倾性：{user_profile.get('extraversion', 0)}/10

用户文档：
{user_document if user_document else '无额外文档'}

驾驶情境：
- 天气：{scenario.get('weather', '未知')}
- 驾驶事件：{scenario.get('random_event', '未知')}
{ai_response_section}
请以JSON格式返回分析结果，包含以下字段：
1. mental_activity: 驾驶员的心理活动（第一人称一段文字描述）
2. driving_actions: 驾驶动作列表（数组，如["按喇叭", "减速", "变道"]等）
3. emotions: 情绪指标（JSON对象，包含：calmness冷静度、alertness警觉度、stress压力度、confidence自信度，每个值0-100）

请只返回JSON格式，不要包含其他解释文字。"""

    return prompt

def call_ollama(prompt):
    """调用Ollama API"""
    payload = {
        'model': OLLAMA_MODEL,
        'prompt': prompt,
        'stream': False,
        'options': {
            'temperature': 0.7,
            'top_p': 0.9
        }
    }
    
    response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
    response.raise_for_status()
    return response.json()

def parse_response(response):
    """解析Ollama响应"""
    # Ollama返回格式：{"response": "..."}
    response_text = response.get('response', '')
    
    # 尝试提取JSON
    try:
        # 查找JSON部分
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            parsed = json.loads(json_str)
            
            # 确保所有必需字段存在
            result = {
                'mental_activity': parsed.get('mental_activity', '正在分析驾驶情境...'),
                'driving_actions': parsed.get('driving_actions', []),
                'emotions': parsed.get('emotions', {
                    'calmness': 50,
                    'alertness': 50,
                    'stress': 50,
                    'confidence': 50
                })
            }
            return result
    except:
        pass
    
    # 如果解析失败，返回默认值
    return {
        'mental_activity': response_text[:200] if response_text else '正在分析驾驶情境...',
        'driving_actions': ['观察路况', '保持车速'],
        'emotions': {
            'calmness': 50,
            'alertness': 50,
            'stress': 50,
            'confidence': 50
        }
    }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

