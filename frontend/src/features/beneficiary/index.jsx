import { lazy } from 'solid-js';

const ManageBeneficiary = lazy(() => import('./components/ManageBeneficiary'));

function Beneficiary() {
	return (
		<>
			<ManageBeneficiary />
		</>
	);
}

export default Beneficiary;
