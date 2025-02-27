import chalk from 'chalk';
import colorConvert from 'color-convert';
const K = (name: Parameters<(typeof colorConvert)['keyword']['rgb']>[0]) => {
  const rgb = colorConvert.keyword.rgb(name as 'blue') as [
    number,
    number,
    number,
  ];
  return rgb;
};
export const methodToColor = (method: string) => {
  switch (method) {
    case 'GET': {
      return chalk.bold.green('GET');
    }
    case 'POST': {
      return chalk.bold.yellow('POST');
    }
    case 'PUT': {
      return chalk.bold.blue('PUT');
    }
    case 'PATCH': {
      return chalk.bold.rgb(...K('purple'))('PATCH');
    }
    case 'DELETE': {
      return chalk.bold.red('DELETE');
    }
    case 'HEAD': {
      return chalk.bold.green('HEAD');
    }
    case 'OPTIONS': {
      return chalk.bold.magenta('OPTIONS');
    }
    default: {
      return chalk.bold.bgRed(method);
    }
  }
};
