const servers: string[] = [];

for (const key in process.env) {
  if (/^SERVER\d+$/.test(key)) {
    if (process.env[key]) servers.push(process.env[key] as string);
  }
}

export default servers;
