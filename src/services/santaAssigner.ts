import path from 'path';
import { AssignedSantaData, EmployeeDataTypes } from '../types/types';
import { CsvParser } from './csvParser';
import { CsvWriter } from './csvWriter';

export class SantaAssigner {
	private shuffle(employeeList: EmployeeDataTypes[]): EmployeeDataTypes[] {
		let len = employeeList.length - 1;
		for (let i = len; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			[employeeList[i], employeeList[randomIndex]] = [
				employeeList[randomIndex],
				employeeList[i],
			];
		}
		return employeeList;
	}

	async assign(currentYearFile: string, previousYearFile?: string) {
		const parser = new CsvParser();
		try {
			const currentYearData =
				await parser.parse<EmployeeDataTypes>(currentYearFile);
			const previousYearData = previousYearFile
				? await parser.parse<AssignedSantaData>(previousYearFile)
				: [];
			const shuffledUser = this.assignData(
				// currentYearData,
				this.shuffle(currentYearData),
				previousYearData,
			);
			const writer = new CsvWriter();
			await writer.write('../data/previousEmployee.csv', shuffledUser);
			console.log(shuffledUser);
		} catch (error) {
			console.log(error.message);
		}
	}

	assignData(
		currentYearData: EmployeeDataTypes[],
		previousYearData: AssignedSantaData[] = [],
	): AssignedSantaData[] {
		const previousYearMap = new Map<string, string>();
		for (const data of previousYearData) {
			previousYearMap.set(
				data.Employee_EmailID,
				data.Secret_Child_EmailID,
			);
		}

		const assignedSet = new Set<string>();
		const result: AssignedSantaData[] = [];

		for (let i = 0; i < currentYearData.length; i++) {
			const giver = currentYearData[i];
			let found = false;

			for (let j = 1; j < currentYearData.length; j++) {
				const receiverIndex = (i + j) % currentYearData.length;
				const receiver = currentYearData[receiverIndex];

				if (
					!assignedSet.has(receiver.Employee_EmailID) &&
					previousYearMap.get(giver.Employee_EmailID) !==
						receiver.Employee_EmailID
				) {
					assignedSet.add(receiver.Employee_EmailID);
					result.push({
						...giver,
						Secret_Child_Name: receiver.Employee_Name,
						Secret_Child_EmailID: receiver.Employee_EmailID,
					});
					found = true;
					break;
				}
			}

			if (!found) {
				throw new Error(
					`No valid assignment found for ${giver.Employee_Name}. Check constraints.`,
				);
			}
		}

		return result;
	}
}
