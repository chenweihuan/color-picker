import Chrome from './index.vue';
import { App } from 'vue';

Chrome.install = (app: App) => {
	app.component(Chrome.name || Chrome.__name, Chrome);
};

export default Chrome;