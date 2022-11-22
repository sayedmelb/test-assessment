export class Questions {
  id: string;
  stem: string;
  type: string;
  strand: string;
  config: ConfigOptions
}

class ConfigOptions {
  options: Array<Options>;
  key: string;
  hint: string;
}

class Options {
  id: string;
  label: string;
  value: string;
}
