import fs from 'fs';
import path from 'path';
import { stringify } from 'csv-stringify';

export class CsvWriter {
	async write<T>(filePath: string, data: T[]): Promise<void> {
		filePath = path.resolve(__dirname, filePath);
		return new Promise((resolve, reject) => {
			const writableStream = fs.createWriteStream(filePath);
			const columns = Object.keys(data[0] || {});

			const stringifier = stringify({ header: true, columns });

			stringifier.on('error', (err) => {
				console.log('Error writing CSV:', err);
				reject(err);
			});

			writableStream.on('finish', () => {
				console.log('CSV file successfully written');
				resolve();
			});

			stringifier.pipe(writableStream);

			data.forEach((row) => stringifier.write(row));

			stringifier.end();
		});
	}
}
