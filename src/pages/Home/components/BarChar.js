// 柱状图组件
import * as echarts from 'echarts';
import { useEffect,useRef } from 'react';


// 1、把功能代码放到这个组件中
// 2、把可变的部分抽象成prop参数

const BarChart = ({title}) =>{
  const chartRef = useRef(null)
  useEffect(()=>{
    // 保证dom可用，才进行图表渲染
    // 获取渲染图表的dom节点
  const chartDom = chartRef.current
  // 生成图表实例对象
  const myChart = echarts.init(chartDom);
  // 准备图表参数

  const option = {
    title:{
      text:title
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }

  option && myChart.setOption(option);
  },[])
  return <div><div ref={chartRef} style={{width:'500px',height:'400px'}}></div></div>


}
export default BarChart


