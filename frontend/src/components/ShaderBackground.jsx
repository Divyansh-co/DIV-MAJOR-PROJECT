import React, { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    let animId;
    function syncSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
      }
    }
    syncSize();
    window.addEventListener('resize', syncSize);

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m * m; m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;
        vec2 mousePos = mouse - 0.5;
        mousePos.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.22;
        float mouseDist = length(p - mousePos);
        float mouseWave = smoothstep(0.48, 0.0, mouseDist);

        float n1 = snoise(p * 2.2 + vec2(t * 0.25, t * 0.18));
        float n2 = snoise(p * 3.8 - vec2(t * 0.12, -t * 0.22) + n1 * 0.5);
        vec2 warpedP = p + (mousePos - p) * mouseWave * 0.24;

        vec2 grid = abs(fract(warpedP * 12.0 - 0.5) - 0.5) / fwidth(warpedP * 12.0);
        float gridLine = 1.0 - min(min(grid.x, grid.y), 1.0);
        gridLine = smoothstep(0.0, 1.2, gridLine) * 0.06;

        vec2 dotGrid = fract(warpedP * 16.0);
        float dots = smoothstep(0.06, 0.02, length(dotGrid - 0.5)) * 0.10;

        vec3 baseBlack = vec3(0.024, 0.027, 0.035);
        vec3 deepPlum  = vec3(0.08, 0.02, 0.05);
        vec3 darkPink  = vec3(0.88, 0.11, 0.45);
        vec3 ember     = vec3(1.0, 0.34, 0.13);

        float glow1 = smoothstep(-0.2, 0.7, n1) * 0.32;
        float glow2 = smoothstep(-0.3, 0.8, n2) * 0.24;

        vec3 col = mix(baseBlack, deepPlum, glow1);
        col += darkPink * glow1 * 0.35 + ember * glow2 * 0.26;
        col += darkPink * mouseWave * 0.30 + ember * (mouseWave * mouseWave) * 0.42;
        col += mix(darkPink, ember, 0.5 + 0.5 * sin(t + warpedP.x * 2.0)) * (gridLine + dots) * (0.7 + mouseWave * 1.3);
        col *= (1.0 - smoothstep(0.4, 1.4, length(uv - 0.5)));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let targetMouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let currentMouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const onMove = (e) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      targetMouse.x = e.clientX * dpr;
      targetMouse.y = (window.innerHeight - e.clientY) * dpr;
    };
    window.addEventListener('mousemove', onMove);

    function loop(t) {
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full -z-10"
      style={{ display: 'block', background: '#06070b' }}
    />
  );
}
