import clsx from 'clsx';
import { cva } from 'class-variance-authority';

// 定义样式变体
const variants = cva('twa inline-block', {
  variants: {
    size: {
      base: '',
      lg: 'twa-lg',
      '2x': 'twa-2x',
      '3x': 'twa-3x',
      '4x': 'twa-4x',
      '5x': 'twa-5x'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
});

// 组件实现
const TwemojiComponent = ({ emoji, size, className }) => {
  return (
    <i className={clsx(
      variants({ size }),  // 应用尺寸变体
      `twa-${emoji}`,      // 添加表情符号类名
      className            // 合并自定义类名
    )} />
  );
};

export default TwemojiComponent;