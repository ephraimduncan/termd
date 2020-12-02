import axios from 'axios';

const NPM_REGISTRY = 'https://registry.npmjs.org/';

const getPackageInfo = async (requiredPackage: string) => {
    const packageHTTPData = await axios.get(NPM_REGISTRY + requiredPackage);
    const packageData = packageHTTPData.data;
    const readme = packageData.readme;
    return readme;
};

const main = async () => {
    const readme = await getPackageInfo('chalk');
    console.log(readme);
};

main();
