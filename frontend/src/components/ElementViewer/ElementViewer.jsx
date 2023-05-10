import { For, onMount } from 'solid-js';
// import { appStore } from "../../data/mainStore";
import moment from 'moment';
import Element from './Element';

const ElementViewer = (props) => {
	return (
		<div>
			<For each={props.data}>
				{(element) => (
					<>
						<Element element={element} />
					</>
				)}
			</For>
		</div>
	);
};

export default ElementViewer;
