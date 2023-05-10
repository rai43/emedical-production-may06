import { Chart as ChartJS, registerables } from 'chart.js';
import TitleCard from '../../../components/Cards/TitleCard';
import { createEffect } from 'solid-js';

ChartJS.register(...registerables);

function LineChart(props) {
	let lineChartRef;

	const labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jue', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

	const data = {
		labels,
		datasets: [
			{
				fill: true,
				label: 'Consultations',
				// data: labels.map(() => {
				// 	return Math.random() * 100 + 500;
				// }),
				data: props.cm,
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	};

	createEffect(() => {
		const ctx = lineChartRef.getContext('2d');
		const myLineChart = new ChartJS(ctx, {
			type: 'line',
			data: data,
		});
	});

	return (
		<TitleCard title={'Consultations terminées'}>
			<canvas ref={lineChartRef}></canvas>
		</TitleCard>
	);
}

export default LineChart;
