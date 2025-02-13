import fs from 'fs';
import csv from 'csv-parser';

export class CsvParser {
	async parse<T>(filePath: string): Promise<T[]> {
		const parsedValue: T[] = [];
		return new Promise((resolve, reject) => {
			fs.createReadStream(filePath)
				.pipe(csv())
				.on('data', (row) => {
					parsedValue.push(row);
				})
				.on('end', () => {
					console.log('Csv file successfully read');
					resolve(parsedValue);
				})
				.on('error', (err) => {
					console.log('Error reading Csv:', err);
					reject(err);
				});
		});
	}
}
