<template>
  <div class="hero-container">
    <div class="content-area">
      <div class="title-placeholder">
        We make future <br> happen faster.
      </div>
    </div>
    <div class="visual-area">
      <div ref="neuralNetwork" class="neural-network"></div>
      <div class="floating-elements">
        <div class="circuit-pattern">
          <svg viewBox="0 0 300 300" fill="none">
            <path d="M50 50 L250 50 L250 100 L200 100 L200 150 L250 150 L250 250 L50 250 L50 200 L100 200 L100 150 L50 150 Z"
              stroke="#8b5cf6" stroke-width="2" fill="none"/>
            <circle cx="50" cy="50" r="5" fill="#8b5cf6"/>
            <circle cx="250" cy="50" r="5" fill="#8b5cf6"/>
            <circle cx="200" cy="100" r="5" fill="#8b5cf6"/>
            <circle cx="100" cy="200" r="5" fill="#8b5cf6"/>
            <circle cx="250" cy="250" r="5" fill="#8b5cf6"/>
          </svg>
        </div>
        <div class="data-visualization">
          <div
            v-for="(height, i) in dataBarHeights"
            :key="i"
            class="bar"
            :style="{
              height: height + 'px',
              animationDelay: (i * 0.2) + 's'
            }"
          ></div>
        </div>
        <div class="geometric-shapes">
          <div class="shape hexagon"></div>
          <div class="shape circle"></div>
          <div class="triangle"></div>
        </div>
        <div class="gradient-orb"></div>
        <div class="code-lines">
          def neural_network():<br>
          &nbsp;&nbsp;return model.predict()<br><br>
          class AIResearch:<br>
          &nbsp;&nbsp;def __init__(self):<br>
          &nbsp;&nbsp;&nbsp;&nbsp;self.innovation = True
        </div>
      </div>
      <div ref="binaryRain" class="binary-rain"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      dataBarHeights: [30, 50, 25, 45, 35, 55, 40, 30],
      nodes: []
    }
  },
  mounted() {
    this.createNeuralNetwork();
    this.createBinaryRain();
  },
  methods: {
    createNeuralNetwork() {
      const container = this.$refs.neuralNetwork;
      if (!container) return;
      container.innerHTML = '';
      this.nodes = [];
      // Match the HTML: 4 layers, 4-6-6-4 nodes, 25% horizontal spacing
      for (let layer = 0; layer < 4; layer++) {
        const nodesInLayer = layer === 1 || layer === 2 ? 6 : 4;
        for (let i = 0; i < nodesInLayer; i++) {
          const node = document.createElement('div');
          node.className = 'node';
          node.style.left = (20 + layer * 25) + '%';
          node.style.top = (15 + (i * 70 / nodesInLayer)) + '%';
          node.style.animationDelay = (Math.random() * 3) + 's';
          container.appendChild(node);
          this.nodes.push({
            element: node,
            layer,
            index: i,
            x: 20 + layer * 25,
            y: 15 + (i * 70 / nodesInLayer)
          });
        }
      }
      // Connections
      for (let i = 0; i < this.nodes.length - 1; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          if (this.nodes[j].layer === this.nodes[i].layer + 1) {
            const connection = document.createElement('div');
            connection.className = 'connection';
            const x1 = this.nodes[i].x;
            const y1 = this.nodes[i].y;
            const x2 = this.nodes[j].x;
            const y2 = this.nodes[j].y;
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            connection.style.width = length + '%';
            connection.style.left = x1 + '%';
            connection.style.top = y1 + '%';
            connection.style.transform = `rotate(${angle}deg)`;
            connection.style.transformOrigin = '0 50%';
            connection.style.animationDelay = (Math.random() * 4) + 's';
            container.appendChild(connection);
          }
        }
      }
    },
    createBinaryRain() {
      const container = this.$refs.binaryRain;
      if (!container) return;
      container.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        const column = document.createElement('div');
        column.className = 'binary-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 10 + 15) + 's';
        column.style.animationDelay = Math.random() * 5 + 's';
        let binaryString = '';
        for (let j = 0; j < 50; j++) {
          binaryString += Math.random() > 0.5 ? '1' : '0';
          if (j % 8 === 7) binaryString += '<br>';
        }
        column.innerHTML = binaryString;
        container.appendChild(column);
      }
    }
  }
}
</script>

<style scoped>
.hero-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f6ff 30%, #e6d9ff 60%, #8b5cf6 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.content-area {
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: relative;
}
.title-placeholder {
  color: #6b46c1;
  font-size: 3rem;
  font-weight: 300;
  opacity: 0.3;
  text-align: center;
  font-family: 'Arial', sans-serif;
  letter-spacing: 2px;
}
.visual-area {
  width: 55%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.neural-network {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}
.node {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #8b5cf6;
  animation: pulse 3s infinite ease-in-out;
}
.connection {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  opacity: 0.3;
  animation: flow 4s infinite linear;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.5); opacity: 1; }
}
@keyframes flow {
  0% { opacity: 0; }
  50% { opacity: 0.6; }
  100% { opacity: 0; }
}
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}
.circuit-pattern {
  position: absolute;
  right: 10%;
  top: 20%;
  width: 300px;
  height: 300px;
  opacity: 0.15;
  animation: rotate 20s infinite linear;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.data-visualization {
  position: absolute;
  right: 15%;
  bottom: 15%;
  width: 200px;
  height: 150px;
  opacity: 0.2;
}
.bar {
  width: 8px;
  background: linear-gradient(180deg, #8b5cf6, #c4b5fd);
  margin: 2px;
  border-radius: 4px;
  animation: dataFlow 2s infinite ease-in-out;
  display: inline-block;
  vertical-align: bottom;
}
@keyframes dataFlow {
  0%, 100% { height: 20px; }
  50% { height: 60px; }
}
.geometric-shapes {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 100px;
  height: 100px;
}
.shape {
  position: absolute;
  border: 2px solid #8b5cf6;
  opacity: 0.3;
  animation: float 6s infinite ease-in-out;
}
.hexagon {
  width: 50px;
  height: 50px;
  background: transparent;
  border: 2px solid #8b5cf6;
  transform: rotate(45deg);
}
.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 30px;
  left: 20px;
  animation-delay: -2s;
}
.triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 25px solid #8b5cf6;
  opacity: 0.3;
  top: 60px;
  left: 40px;
  animation: float 6s infinite ease-in-out;
  animation-delay: -4s;
}
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(120deg); }
  66% { transform: translateY(5px) rotate(240deg); }
}
.gradient-orb {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
  animation: breathe 4s infinite ease-in-out;
}
@keyframes breathe {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.1); }
}
.code-lines {
  position: absolute;
  top: 40%;
  right: 8%;
  opacity: 0.15;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #8b5cf6;
  line-height: 1.6;
}
.binary-rain {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  overflow: hidden;
}
.binary-column {
  position: absolute;
  top: -100%;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #8b5cf6;
  animation: fall linear infinite;
  white-space: nowrap;
}
@keyframes fall {
  to { transform: translateY(100vh); }
}
@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
  }
  .content-area, .visual-area {
    width: 100%;
    height: 50%;
  }
  .title-placeholder {
    font-size: 3rem;
  }
}
</style>