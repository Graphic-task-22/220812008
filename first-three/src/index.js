import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let renderer, camera, scene, ambientLight, earth;

function init() {
  // 创建场景
  scene = new THREE.Scene();

  // 环境光
  ambientLight = new THREE.AmbientLight(0xffffff, 1); // 设置环境光
  scene.add(ambientLight);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 10, 10); // 设置相机位置
  camera.lookAt(0, 0, 0); // 相机朝向原点

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1); // 设置背景颜色
  document.body.appendChild(renderer.domElement);

  // 加载地球纹理并应用
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load(
    '/assets/earth_day_4096.jpg', // 确保图片位于 public/assets 目录下
    function (texture) {
      // 确保纹理加载成功后，再创建地球
      console.log('Earth texture loaded successfully!');
      
      // 创建地球材质
      const earthMaterial = new THREE.MeshBasicMaterial({ map: texture });

      // 创建地球几何体和网格
      const earthGeometry = new THREE.SphereGeometry(5, 32, 32); // 创建一个球体，半径为5，分段为32
      earth = new THREE.Mesh(earthGeometry, earthMaterial); // 使用材质和几何体创建地球
      scene.add(earth); // 将地球添加到场景中

      // 渲染场景
      renderer.render(scene, camera); // 渲染场景
    },
    undefined,
    function (error) {
      console.error('Error loading earth texture:', error);
    }
  );
}

// 初始化辅助功能（坐标轴、轨道控制器等）
function initHelper() {
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  // 设置相机控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', function () {
    renderer.render(scene, camera); // 当相机视角改变时，重新渲染场景
  });

  // 设置网格帮助器
  const gridHelper = new THREE.GridHelper(300, 300, 0x004444, 0x004444);
  scene.add(gridHelper);
}

// 动画函数，控制地球的旋转
function animate() {
  requestAnimationFrame(animate); // 递归调用以实现动画效果

  // 让地球旋转
  if (earth) {
    earth.rotation.y += 0.01; // 让地球绕Y轴旋转
  }

  // 渲染场景
  renderer.render(scene, camera);
}

// 初始化统计功能
function initStats() {
  const stats = new Stats();
  document.body.appendChild(stats.domElement);

  function render() {
    stats.update(); // 更新性能统计数据
    renderer.render(scene, camera); // 渲染场景
    requestAnimationFrame(render); // 递归调用
  }
  render();
}

init(); // 初始化场景
initHelper(); // 初始化辅助功能
initStats(); // 初始化性能统计
animate(); // 启动动画循环
