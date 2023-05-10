import { Chart as ChartJS, registerables } from 'chart.js';

import TitleCard from '../../../components/Cards/TitleCard';
import Subtitle from '../../../components/Typography/Subtitle';
import { createEffect } from 'solid-js';

ChartJS.register(...registerables);

function DoughnutChart(props) {
	let doughnutChartRef;
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};

	const labels = props.labels;

	const data = {
		labels,
		datasets: [
			{
				label: '# de consultations',
				data: props.values,
				backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'],
				borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
				borderWidth: 1,
			},
		],
	};

	createEffect(() => {
		const ctx = doughnutChartRef.getContext('2d');
		const myBarChart = new ChartJS(ctx, {
			type: 'doughnut',
			data: data,
		});
	});

	return (
		<TitleCard title={'Consultations terminées'}>
			{/* <Doughnut options={options} data={data} /> */}
			<canvas ref={doughnutChartRef}>f</canvas>
		</TitleCard>
	);
}

export default DoughnutChart;
