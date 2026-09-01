// utils/processData.js
export const processData = (words) => {
    return words.map(word => ({
      text: word.text,
      size: Number(word.size) * 2 // 调整词云大小比例
    }));
  };