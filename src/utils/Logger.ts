class Logger {
	private getSource(src?: string) {
		return src?.toUpperCase() || 'OTHER';
	}
	public info(message?: any, src?: string) {
		console.info(
			`\u001b[1m\u001b[33;1m[ ${this.toHHMMSS(
				new Date(),
			)} ] INFO [ ${this.getSource(src)} ] ${message}`,
		);
	}
	public error(err?: any, src?: string) {
		const message = err?.message || err || 'Unknown error';
		console.error(
			`\u001b[1m\u001b[31;1m[ ${this.toHHMMSS(
				new Date(),
			)} ] ERROR [ ${this.getSource(src)} ] ${message}`,
		);
	}

	public debug(msg?: string, src?: string) {
		console.debug(
			`\u001b[1m\u001b[36;1m[ ${this.toHHMMSS(
				new Date(),
			)} ] DEBUG [ ${this.getSource(src)} ] ${msg}`,
		);
	}

	private toHHMMSS(time: Date) {
		let hours = time.getHours().toString().padStart(2, '0');
		let minutes = time.getMinutes().toString().padStart(2, '0');
		let seconds = time.getSeconds().toString().padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}
}

export default new Logger();
