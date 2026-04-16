# AI驾驶员行为模拟系统

一个基于Flask和Ollama的驾驶员行为模拟系统，通过大模型分析用户画像和驾驶情境，实时生成驾驶员的心理活动、驾驶动作和情绪指标。

## 功能特点

- **用户画像编辑器**：支持输入姓名、年龄、职业、驾驶年龄和性格特征（大五人格模型）
- **情景编辑器**：可选择天气条件和随机驾驶事件
- **可视化界面**：粒子流动效果和驾驶员形象展示
- **实时反馈**：显示心理活动、驾驶动作和情绪仪表盘

## 技术栈

- **后端**：Flask
- **前端**：HTML5, CSS3, JavaScript
- **AI模型**：Ollama (deepseek-r1)

## 安装和运行

### 1. 安装Python依赖

```bash
pip install -r requirements.txt
```

### 2. 确保Ollama已安装并运行

```bash
# 安装Ollama（如果未安装）
# 访问 https://ollama.ai 下载安装

# 拉取deepseek-r1模型
ollama pull deepseek-r1

# 确保Ollama服务运行在默认端口（11434）
```

### 3. 配置环境变量（可选）

创建 `.env` 文件：

```
OLLAMA_API_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=deepseek-r1
```

### 4. 运行应用

```bash
python app.py
```

### 5. 访问应用

打开浏览器访问：http://localhost:5000

## 使用说明

1. **填写用户画像**：在左侧面板输入驾驶员的基本信息和性格特征
2. **设置驾驶情境**：选择天气和随机事件
3. **上传文档**（可选）：可以上传额外的用户文档信息
4. **生成模拟**：点击中间的"生成模拟"按钮
5. **查看反馈**：右侧面板会显示实时的心理活动、驾驶动作和情绪指标

## 项目结构

```
AI4D-HB2/
├── app.py                 # Flask应用主文件
├── requirements.txt       # Python依赖
├── templates/
│   └── index.html        # 主页面模板
├── static/
│   ├── css/
│   │   └── style.css     # 样式文件
│   └── js/
│       └── main.js       # 前端JavaScript逻辑
└── README.md             # 项目说明文档
```

## 注意事项

- 确保Ollama服务正常运行
- 首次使用可能需要等待模型加载
- 建议使用现代浏览器以获得最佳体验

<img width="1670" height="942" alt="image" src="https://github.com/user-attachments/assets/96c2eef2-debd-4a51-9629-a4a053a90df5" />

<img width="1685" height="935" alt="image" src="https://github.com/user-attachments/assets/344cca71-f88e-4ddb-a46b-355c45dd0939" />


