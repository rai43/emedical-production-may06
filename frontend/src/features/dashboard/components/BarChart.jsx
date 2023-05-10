import { Chart as ChartJS, registerables } from 'chart.js';

import TitleCard from '../../../components/Cards/TitleCard';
import { createEffect } from 'solid-js';

ChartJS.register(...registerables);

function BarChart(props) {
	let barChartRef;

	const labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jue', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

	const data = {
		labels,
		datasets: [
			{
				label: 'Consultations terminées',
				data: props.cm,
				// data: labels.map(() => {
				// 	return Math.random() * 1000 + 500;
				// }),
				backgroundColor: 'rgba(255, 99, 132, 1)',
			},
			{
				label: 'Consultations en attentes',
				data: props.cw,
				// data: labels.map(() => {
				// 	return Math.random();
				// }),
				backgroundColor: 'rgba(53, 162, 235, 1)',
			},
		],
	};

	// const options = {
	//   responsive: true,
	//   plugins: {
	//     legend: {
	//       position: "top",
	//     },
	//   },
	// };

	createEffect(() => {
		const ctx = barChartRef.getContext('2d');
		const myBarChart = new ChartJS(ctx, {
			type: 'bar',
			data: data,
		});
	});

	return (
		<TitleCard title={'Consultations terminées Vs en attentes'}>
			<canvas ref={barChartRef}>f</canvas>
		</TitleCard>
	);
}

export default BarChart;
