import { App } from 'vue';
import ChromeColorPicker from './chrome';

export {
	ChromeColorPicker,
};

const components = [
    ChromeColorPicker,
];
const install = (app: App) => {
	components.forEach((item) => {
		app.component(item.name || item.__name, item);
	});
};

export default {
	install,
};