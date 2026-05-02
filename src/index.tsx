import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import {App} from './App';
import {initServerSync} from './utils/serverSync';

initServerSync();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ChakraProvider value={defaultSystem}>
			<App />
		</ChakraProvider>
	</StrictMode>
);
