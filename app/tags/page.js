import { processData } from '@/components/Tags/processWord'; // 引入处理数据的函数
import WordCloud from '@/components/Tags/WordCloud';

const wordsList = [
    {text:"互联网医疗", size:'20'},
    {text:"基因检测", size:'30'},
    {text:"医疗服务", size:'26'},
    {text:"再生医学", size:'30'},
    {text:"生物科技", size:'26'},
    {text:"医药", size:'40'},
    {text:"免疫治疗", size:'16'},
    {text:"体外诊断", size:'20'},
    {text:"医疗设备", size:'30'},
    {text:"医疗影像", size:'24'},
    {text:"脑科学", size:'20'},
];

export default function tagsPage() {
  const processedData = processData(wordsList);
  return <WordCloud data={processedData} />;
}