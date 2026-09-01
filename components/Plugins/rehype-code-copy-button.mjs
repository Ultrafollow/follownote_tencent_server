// components/Plugins/rehype-code-copy-button.mjs
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import crypto from "crypto";

const copyIcon = h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'copy-icon'
}, [
  h('rect', { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }),
  h('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' })
]);

const checkIcon = h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 1024 1024',
  className: 'check-icon',
  fill: 'currentColor',
  'aria-hidden': true
}, [
  h('path', { 
    d: 'M343.04 470.848a42.688 42.688 0 0 0-60.288 60.352l146.752 146.752c16.64 16.64 43.648 16.64 60.352 0l251.52-251.52a42.688 42.688 0 1 0-60.416-60.352L459.648 587.392 343.104 470.848z'
  }),
  h('path', {
    d: 'M512 85.312a426.688 426.688 0 1 0 0 853.376A426.688 426.688 0 0 0 512 85.312zM170.624 512a341.312 341.312 0 1 1 682.688 0A341.312 341.312 0 0 1 170.624 512z'
  })
]);

export default function rehypeCodeCopyButton() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre') {
        const codeElement = node.children.find(child => child.tagName === 'code');
        if (codeElement) {
          const btnid = crypto.randomUUID();
          
          const button = h('button', {
            type: 'button',
            className: 'copy-code-button',
            id: btnid,
            'data-copy-code-button': true,
            'aria-label': '复制代码'
          }, [copyIcon, checkIcon]);

          node.properties.className = [
            ...(node.properties.className || []),
            'pre-with-code'
          ];
          node.children.push(button);
        }
      }
    });
  }
}