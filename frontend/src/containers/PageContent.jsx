import { Routes, Route } from '@solidjs/router';

const Header = lazy(() => import('./Header'));
const SuspenseContent = lazy(() => import('./SuspenseContent'));

import routes from '../routes/index';
import { lazy } from 'solid-js';

function PageContent() {
	let mainContentRef;

	return (
		<div class='drawer-content flex flex-col '>
			<Header />
			<main
				class='flex-1 overflow-y-auto pt-8 px-6  bg-base-200'
				ref={mainContentRef}
			>
				<Suspense fallback={<SuspenseContent />}>
					<Routes>
						{routes.map((route, key) => {
							return (
								<Route
									exact={true}
									path={`${route.path}`}
									element={<route.component />}
								/>
							);
						})}

						{/* Redirecting unknown url to 404 page */}
						<Route
							path='*'
							element={<p>error</p>}
						/>
						{/* <Route path="*" element={<Page404 />} /> */}
					</Routes>
				</Suspense>
				<div class='h-16'></div>
			</main>
		</div>
	);
}

export default PageContent;
