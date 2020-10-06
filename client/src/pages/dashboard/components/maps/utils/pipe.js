const pipe = (...args) => (d) => args.reduce((m, f) => f(m), d);
export default pipe;