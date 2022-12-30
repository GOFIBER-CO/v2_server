import { useEffect, useState } from "react";
import { Line, LineConfig } from '@ant-design/plots'

const Chart = () => {
    const [data, setData] = useState<Record<string, any>[]>([])
    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
          .then((response) => response.json())
          .then((json) => setData(json))
          .catch((error) => {
            console.log('fetch data failed', error);
          });
      };
      useEffect(() => {
        asyncFetch();
      }, []);

      const config1:LineConfig = {
        data,
        color: 'blue',
        padding: 'auto',
        xField: 'Date',
        yField: 'scales',
        xAxis: {
          // type: 'timeCat',
          tickCount: 5,
        },
      };
      const config2:LineConfig = {
        data,
        color: 'red',
        padding: 'auto',
        xField: 'Date',
        yField: 'scales',
        xAxis: {
          // type: 'timeCat',
          tickCount: 5,
        },
      };
    return (
        <div className = "chart" style={{display: 'flex', marginTop: '20px', height: '90%', marginRight: '20px'}}>
            <div className = "cpu-chart" style={{flex: 1}}>
                <Line {...config1} />
            </div>
            <div className="ram-chart" style={{flex: 1, marginLeft: '20px'}}>
                <Line {...config2} />
            </div>
        </div>
    )
}

export default Chart