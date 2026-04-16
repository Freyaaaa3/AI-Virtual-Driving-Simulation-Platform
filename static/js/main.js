// 蓝色粒子流系统 - 可形成人形
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 200;
        this.centerX = 0;
        this.centerY = 0;
        
        // 状态：'scatter'（散开）, 'person'（人形）
        this.state = 'scatter';
        this.stateTimer = 0;
        this.stateDuration = 4000; // 每个状态持续4秒
        this.transitionDuration = 2000; // 过渡时间2秒
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.updateTargetPositions();
    }
    
    // 定义人形的形状（相对坐标）- 优化版
    getPersonShape() {
        const scale = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        const points = [];
        
        // 头部（圆形，更大更清晰）
        const headRadius = scale * 0.15;
        const headPoints = 35;
        for (let i = 0; i < headPoints; i++) {
            const angle = (Math.PI * 2 * i) / headPoints;
            points.push({
                x: Math.cos(angle) * headRadius,
                y: -scale * 0.4 + Math.sin(angle) * headRadius
            });
        }
        
        // 身体（梯形，更符合人体比例）
        const bodyTopWidth = scale * 0.18;
        const bodyBottomWidth = scale * 0.22;
        const bodyHeight = scale * 0.35;
        const bodyPoints = 50;
        
        // 身体左侧（从肩膀到腰部）
        for (let i = 0; i < bodyPoints; i++) {
            const t = i / bodyPoints;
            const width = bodyTopWidth + (bodyBottomWidth - bodyTopWidth) * t;
            const x = -width / 2;
            const y = -scale * 0.15 + t * bodyHeight;
            points.push({ x, y });
        }
        // 身体底部
        for (let i = 0; i < bodyPoints; i++) {
            const t = i / bodyPoints;
            const x = -bodyBottomWidth / 2 + (t * bodyBottomWidth);
            const y = -scale * 0.15 + bodyHeight;
            points.push({ x, y });
        }
        // 身体右侧（从腰部到肩膀）
        for (let i = 0; i < bodyPoints; i++) {
            const t = i / bodyPoints;
            const width = bodyBottomWidth - (bodyBottomWidth - bodyTopWidth) * t;
            const x = width / 2;
            const y = -scale * 0.15 + bodyHeight - t * bodyHeight;
            points.push({ x, y });
        }
        // 身体顶部
        for (let i = 0; i < bodyPoints; i++) {
            const t = i / bodyPoints;
            const x = bodyTopWidth / 2 - (t * bodyTopWidth);
            const y = -scale * 0.15;
            points.push({ x, y });
        }
        
        // 肩膀（更宽更自然）
        const shoulderWidth = scale * 0.25;
        const shoulderPoints = 20;
        for (let i = 0; i < shoulderPoints; i++) {
            const t = i / shoulderPoints;
            const x = -shoulderWidth / 2 + (t * shoulderWidth);
            const y = -scale * 0.12;
            points.push({ x, y });
        }
        
        // 手臂（两条，更自然的角度）
        const armLength = scale * 0.28;
        const armWidth = scale * 0.06;
        const armPoints = 25;
        
        // 左臂（稍微向外倾斜）
        for (let i = 0; i < armPoints; i++) {
            const t = i / armPoints;
            const offsetX = -t * scale * 0.05;
            const x = -shoulderWidth / 2 - armWidth / 2 + offsetX;
            const y = -scale * 0.1 + t * armLength;
            points.push({ x, y });
        }
        for (let i = 0; i < armPoints; i++) {
            const t = i / armPoints;
            const offsetX = -scale * 0.05 + t * scale * 0.05;
            const x = -shoulderWidth / 2 - armWidth / 2 + offsetX;
            const y = -scale * 0.1 + armLength;
            points.push({ x, y });
        }
        for (let i = 0; i < armPoints; i++) {
            const t = i / armPoints;
            const offsetX = -t * scale * 0.05;
            const x = -shoulderWidth / 2 - armWidth / 2 + armWidth + offsetX;
            const y = -scale * 0.1 + armLength - t * armLength;
            points.push({ x, y });
        }
        
        // 右臂（稍微向外倾斜）
        for (let i = 0; i < armPoints; i++) {
            const t = i / armPoints;
            const offsetX = t * scale * 0.05;
            const x = shoulderWidth / 2 + armWidth / 2 + offsetX;
            const y = -scale * 0.1 + t * armLength;
            points.push({ x, y });
        }
        for (let i = 0; i < armPoints; i++) {
            const t = i / armPoints;
            const offsetX = scale * 0.05 - t * scale * 0.05;
            const x = shoulderWidth / 2 + armWidth / 2 + offsetX;
            const y = -scale * 0.1 + armLength;
            points.push({ x, y });
        }
        for (let i = 0; i < armPoints; i++) {
            const t = i / armPoints;
            const offsetX = t * scale * 0.05;
            const x = shoulderWidth / 2 + armWidth / 2 - armWidth + offsetX;
            const y = -scale * 0.1 + armLength - t * armLength;
            points.push({ x, y });
        }
        
        // 腿部（两条，更粗更稳定）
        const legLength = scale * 0.3;
        const legWidth = scale * 0.08;
        const legPoints = 25;
        
        // 左腿
        for (let i = 0; i < legPoints; i++) {
            const t = i / legPoints;
            const x = -bodyBottomWidth * 0.25 - legWidth / 2;
            const y = -scale * 0.15 + bodyHeight + t * legLength;
            points.push({ x, y });
        }
        for (let i = 0; i < legPoints; i++) {
            const t = i / legPoints;
            const x = -bodyBottomWidth * 0.25 - legWidth / 2 + t * legWidth;
            const y = -scale * 0.15 + bodyHeight + legLength;
            points.push({ x, y });
        }
        for (let i = 0; i < legPoints; i++) {
            const t = i / legPoints;
            const x = -bodyBottomWidth * 0.25 - legWidth / 2 + legWidth - t * legWidth;
            const y = -scale * 0.15 + bodyHeight + legLength - t * legLength;
            points.push({ x, y });
        }
        
        // 右腿
        for (let i = 0; i < legPoints; i++) {
            const t = i / legPoints;
            const x = bodyBottomWidth * 0.25 + legWidth / 2;
            const y = -scale * 0.15 + bodyHeight + t * legLength;
            points.push({ x, y });
        }
        for (let i = 0; i < legPoints; i++) {
            const t = i / legPoints;
            const x = bodyBottomWidth * 0.25 + legWidth / 2 - t * legWidth;
            const y = -scale * 0.15 + bodyHeight + legLength;
            points.push({ x, y });
        }
        for (let i = 0; i < legPoints; i++) {
            const t = i / legPoints;
            const x = bodyBottomWidth * 0.25 + legWidth / 2 - legWidth + t * legWidth;
            const y = -scale * 0.15 + bodyHeight + legLength - t * legLength;
            points.push({ x, y });
        }
        
        return points;
    }
    
    init() {
        this.particles = [];
        const scatterRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * scatterRadius;
            this.particles.push({
                x: this.centerX + Math.cos(angle) * radius,
                y: this.centerY + Math.sin(angle) * radius,
                targetX: this.centerX + Math.cos(angle) * radius,
                targetY: this.centerY + Math.sin(angle) * radius,
                vx: 0,
                vy: 0,
                size: Math.random() * 2 + 2,
                opacity: Math.random() * 0.4 + 0.6,
                baseAngle: angle
            });
        }
        
        this.updateTargetPositions();
    }
    
    updateTargetPositions() {
        let shapePoints = [];
        
        if (this.state === 'person') {
            shapePoints = this.getPersonShape();
        } else {
            // 散开状态
            const scatterRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
            shapePoints = [];
            for (let i = 0; i < this.particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * scatterRadius;
                shapePoints.push({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                });
            }
        }
        
        // 如果形状点数少于粒子数，循环使用
        this.particles.forEach((particle, index) => {
            const pointIndex = index % shapePoints.length;
            const point = shapePoints[pointIndex];
            particle.targetX = this.centerX + point.x;
            particle.targetY = this.centerY + point.y;
        });
    }
    
    updateState(deltaTime) {
        this.stateTimer += deltaTime;
        
        // 循环：散开 -> 人形 -> 散开...
        const totalCycleTime = this.stateDuration * 2 + this.transitionDuration * 2;
        const cycleTime = this.stateTimer % totalCycleTime;
        
        let newState = this.state;
        
        if (cycleTime < this.stateDuration) {
            // 散开阶段
            newState = 'scatter';
        } else if (cycleTime < this.stateDuration + this.transitionDuration) {
            // 过渡到人形
            newState = 'person';
        } else if (cycleTime < this.stateDuration * 2 + this.transitionDuration) {
            // 保持人形
            newState = 'person';
        } else {
            // 过渡回散开
            newState = 'scatter';
        }
        
        if (newState !== this.state) {
            this.state = newState;
            this.updateTargetPositions();
        }
    }
    
    animate() {
        const now = performance.now();
        const deltaTime = now - (this.lastTime || now);
        this.lastTime = now;
        
        // 更新状态
        this.updateState(deltaTime);
        
        // 清空画布，保持透明以显示背景图片
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach((particle, index) => {
            // 平滑移动到目标位置
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 1) {
                const speed = this.state === 'scatter' ? 0.05 : 0.08;
                particle.vx = dx * speed;
                particle.vy = dy * speed;
            } else {
                particle.vx *= 0.9;
                particle.vy *= 0.9;
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 添加轻微的随机抖动（仅在非散开状态）
            if (this.state !== 'scatter') {
                particle.x += (Math.random() - 0.5) * 0.5;
                particle.y += (Math.random() - 0.5) * 0.5;
            }
            
            // 绘制发光粒子
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, `rgba(0, 212, 255, ${particle.opacity})`);
            gradient.addColorStop(0.5, `rgba(0, 212, 255, ${particle.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(0, 212, 255, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // 添加外圈光晕
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity * 0.2})`;
            this.ctx.fill();
        });
        
        // 绘制连线（更明显的蓝色流线）
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        const maxDistance = this.state === 'scatter' ? 100 : 80;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.5;
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(123, 47, 247, ${opacity * 0.6})`);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                }
            }
        }
    }
}

// 初始化粒子系统
let particleSystem;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    particleSystem = new ParticleSystem(canvas);
    
    // 初始化雷达图
    initPersonalityRadar();
    
    // 性格滑块事件
    setupPersonalitySliders();
    
    // 天气图标选择
    setupWeatherIcons();
    
    // 文件上传事件
    setupFileUpload();
    
    // 生成按钮事件
    setupGenerateButton();
});

// 雷达图绘制
let radarChart = null;

function initPersonalityRadar() {
    const canvas = document.getElementById('personalityRadar');
    if (!canvas) return;
    
    radarChart = {
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        centerX: 0,
        centerY: 0,
        radius: 0,
        labels: ['宜人性', '尽责性', '神经质', '开放性', '外倾性'],
        maxValue: 10
    };
    
    resizeRadar();
    window.addEventListener('resize', resizeRadar);
    drawRadar();
}

function resizeRadar() {
    if (!radarChart) return;
    const canvas = radarChart.canvas;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    radarChart.centerX = canvas.width / 2;
    radarChart.centerY = canvas.height / 2;
    radarChart.radius = Math.min(canvas.width, canvas.height) / 2 - 40;
    
    drawRadar();
}

function drawRadar() {
    if (!radarChart) return;
    
    const ctx = radarChart.ctx;
    const centerX = radarChart.centerX;
    const centerY = radarChart.centerY;
    const radius = radarChart.radius;
    const numPoints = 5;
    
    // 清空画布
    ctx.clearRect(0, 0, radarChart.canvas.width, radarChart.canvas.height);
    
    // 绘制背景网格
    ctx.strokeStyle = 'rgba(160, 174, 192, 0.3)';
    ctx.lineWidth = 1;
    
    // 绘制同心圆
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // 绘制轴线
    ctx.strokeStyle = 'rgba(160, 174, 192, 0.5)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    
    // 获取当前值
    const values = [
        parseInt(document.getElementById('agreeableness').value) || 5,
        parseInt(document.getElementById('conscientiousness').value) || 5,
        parseInt(document.getElementById('neuroticism').value) || 5,
        parseInt(document.getElementById('openness').value) || 5,
        parseInt(document.getElementById('extraversion').value) || 5
    ];
    
    // 绘制数据区域
    ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const value = values[i];
        const r = (radius * value) / radarChart.maxValue;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 绘制数据点
    ctx.fillStyle = 'rgba(0, 212, 255, 1)';
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const value = values[i];
        const r = (radius * value) / radarChart.maxValue;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 绘制标签
    ctx.fillStyle = 'rgba(160, 174, 192, 0.9)';
    ctx.font = '14px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const labelRadius = radius + 25;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        
        ctx.fillText(radarChart.labels[i], x, y);
    }
}

function setupPersonalitySliders() {
    const sliders = ['agreeableness', 'conscientiousness', 'neuroticism', 'openness', 'extraversion'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliderId + '-value');
        
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
            drawRadar(); // 更新雷达图
        });
    });
}

function setupWeatherIcons() {
    const weatherIcons = document.querySelectorAll('.weather-icon');
    const weatherInput = document.getElementById('weather');
    
    weatherIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            weatherIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            weatherInput.value = icon.dataset.weather;
        });
    });
    
    // 默认选择第一个
    if (weatherIcons.length > 0) {
        weatherIcons[0].classList.add('active');
    }
}

// 文件上传处理
let userDocumentContent = '';

function setupFileUpload() {
    const fileInput = document.getElementById('user_document');
    const fileNameDisplay = document.getElementById('file-name');
    
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = `已选择: ${file.name}`;
            
            // 读取文件内容
            try {
                if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
                    // 文本文件直接读取
                    const text = await file.text();
                    userDocumentContent = text;
                } else {
                    // 对于其他文件类型，提示用户
                    fileNameDisplay.textContent = `已选择: ${file.name} (仅支持文本文件)`;
                    userDocumentContent = '';
                    alert('目前仅支持文本文件(.txt)，其他格式文件暂不支持读取内容');
                }
            } catch (error) {
                console.error('读取文件失败:', error);
                fileNameDisplay.textContent = '文件读取失败';
                userDocumentContent = '';
            }
        } else {
            fileNameDisplay.textContent = '';
            userDocumentContent = '';
        }
    });
    
    // 支持拖拽上传
    const fileLabel = document.querySelector('.file-label');
    if (fileLabel) {
        fileLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileLabel.style.borderColor = 'var(--accent-blue)';
            fileLabel.style.background = 'rgba(0, 212, 255, 0.1)';
        });
        
        fileLabel.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileLabel.style.borderColor = 'var(--border-color)';
            fileLabel.style.background = 'var(--bg-tertiary)';
        });
        
        fileLabel.addEventListener('drop', async (e) => {
            e.preventDefault();
            fileLabel.style.borderColor = 'var(--border-color)';
            fileLabel.style.background = 'var(--bg-tertiary)';
            
            const file = e.dataTransfer.files[0];
            if (file) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }
}

function setupGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    
    generateBtn.addEventListener('click', async () => {
        // 收集表单数据
        const userProfile = {
            name: document.getElementById('name').value || '未知',
            age: document.getElementById('age').value || '未知',
            occupation: document.getElementById('occupation').value || '未知',
            driving_years: document.getElementById('driving_years').value || '未知',
            agreeableness: parseInt(document.getElementById('agreeableness').value),
            conscientiousness: parseInt(document.getElementById('conscientiousness').value),
            neuroticism: parseInt(document.getElementById('neuroticism').value),
            openness: parseInt(document.getElementById('openness').value),
            extraversion: parseInt(document.getElementById('extraversion').value)
        };
        
        const scenario = {
            weather: document.getElementById('weather').value,
            random_event: document.getElementById('random_event').value
        };
        
        const userDocument = userDocumentContent;
        const aiResponse = document.getElementById('ai_response').value;
        
        // 显示加载状态
        generateBtn.classList.add('loading');
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>生成中...</span>';
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_profile: userProfile,
                    scenario: scenario,
                    user_document: userDocument,
                    ai_response: aiResponse
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                updateFeedback(result.data);
            } else {
                throw new Error(result.error || '生成失败');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('生成失败：' + error.message);
        } finally {
            generateBtn.classList.remove('loading');
            generateBtn.innerHTML = '<i class="fas fa-play"></i><span>生成模拟</span>';
        }
    });
}

function updateFeedback(data) {
    // 更新心理活动
    const mentalActivity = document.getElementById('mentalActivity');
    mentalActivity.textContent = data.mental_activity || '正在分析驾驶情境...';
    
    // 更新驾驶动作
    const drivingActions = document.getElementById('drivingActions');
    if (data.driving_actions && data.driving_actions.length > 0) {
        drivingActions.innerHTML = '';
        data.driving_actions.forEach((action, index) => {
            setTimeout(() => {
                const actionItem = document.createElement('div');
                actionItem.className = 'action-item';
                actionItem.textContent = action;
                drivingActions.appendChild(actionItem);
            }, index * 200);
        });
    } else {
        drivingActions.innerHTML = '<div class="action-placeholder">暂无动作</div>';
    }
    
    // 更新情绪仪表盘
    if (data.emotions) {
        updateEmotionGauge('calmness', data.emotions.calmness || 50);
        updateEmotionGauge('alertness', data.emotions.alertness || 50);
        updateEmotionGauge('stress', data.emotions.stress || 50);
        updateEmotionGauge('confidence', data.emotions.confidence || 50);
    }
}

function updateEmotionGauge(name, value) {
    const gauge = document.getElementById(name + '-gauge');
    const valueDisplay = document.getElementById(name + '-value');
    
    if (gauge && valueDisplay) {
        gauge.style.width = value + '%';
        valueDisplay.textContent = Math.round(value);
    }
}

