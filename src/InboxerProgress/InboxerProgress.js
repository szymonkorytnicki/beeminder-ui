import { Gauge } from '@ant-design/plots'

export default function InboxerProgress({ progress }) {
    const config = {
        percent: progress,
        range: {
            color: 'l(0) 0:#B8E1FF 1:#3D76DD',
        },
        startAngle: Math.PI,
        endAngle: 2 * Math.PI,
        indicator: null,
        height: 150,
        statistic: {
            title: {
                // offsetY: -36,
                style: {
                    fontSize: '25px',
                    color: '#4B535E',
                },
                formatter: () => parseInt(progress * 100) + '%',
            },
            // content: {
            //   style: {
            //     fontSize: '24px',
            //     lineHeight: '44px',
            //     color: '#4B535E',
            //   }
            // },
        },
    }
    return <Gauge {...config} />
}
