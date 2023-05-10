// import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
// import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import { TbLayoutDashboard } from 'solid-icons/tb';

function PageStats({}) {
	return (
		<div class='stats bg-base-100 shadow'>
			<div class='stat'>
				<div class='stat-figure invisible md:visible'>
					<TbLayoutDashboard class='w-8 h-8' />
				</div>
				<div class='stat-title'>A renseigner stat</div>
				<div class='stat-value'>...</div>
				<div class='stat-desc'>...</div>
			</div>

			<div class='stat'>
				<div class='stat-figure invisible md:visible'>
					<TbLayoutDashboard class='w-8 h-8' />
				</div>
				<div class='stat-title'>A renseigner stat</div>
				<div class='stat-value'>...</div>
				<div class='stat-desc'>...</div>
			</div>
		</div>
	);
}

export default PageStats;
