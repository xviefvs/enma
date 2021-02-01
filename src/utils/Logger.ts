class Logger {
	private getSource(src?: string) {
		return src?.toUpperCase() || 'OTHER';
	}
	public info(message?: any, src?: string) {
		console.log(
			`\u001b[36m[${this.toHHMMSS(new Date())}] INFO [${this.getSource(
				src,
			)}] ${message}`,
		);
	}
	public error(err?: any, src?: string) {
		const message = err?.message || err || 'Unknown error';
		console.error(
			`\u001b[31m[${this.toHHMMSS(new Date())}] ERROR [${this.getSource(
				src,
			)}] ${message}`,
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
