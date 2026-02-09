declare module 'gradient-string' {
  type GradientGenerator = (...colors: string[]) => (text: string) => string;
  const gradient: GradientGenerator & { [key: string]: any };
  export default gradient;
}
declare module 'gradient-string';
