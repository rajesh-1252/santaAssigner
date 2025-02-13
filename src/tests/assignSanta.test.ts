/* eslint-disable @typescript-eslint/no-explicit-any */
import { SantaAssigner } from '../services/santaAssigner';
import { AssignedSantaData, EmployeeDataTypes } from '../types/types';

// Mock the CSV Parser and Writer
jest.mock('../services/csvParser.ts');
jest.mock('../services/csvWriter');
jest.mock('path');

describe('SantaAssigner', () => {
	let santaAssigner: SantaAssigner;

	const mockEmployees: EmployeeDataTypes[] = [
		{ Employee_EmailID: 'emp1@test.com', Employee_Name: 'Employee 1' },
		{ Employee_EmailID: 'emp2@test.com', Employee_Name: 'Employee 2' },
		{ Employee_EmailID: 'emp3@test.com', Employee_Name: 'Employee 3' },
		{ Employee_EmailID: 'emp4@test.com', Employee_Name: 'Employee 4' },
	];

	const mockPreviousAssignments: AssignedSantaData[] = [
		{
			Employee_EmailID: 'emp1@test.com',
			Employee_Name: 'Employee 1',
			Secret_Child_EmailID: 'emp2@test.com',
			Secret_Child_Name: 'Employee 2',
		},
		{
			Employee_EmailID: 'emp2@test.com',
			Employee_Name: 'Employee 2',
			Secret_Child_EmailID: 'emp3@test.com',
			Secret_Child_Name: 'Employee 3',
		},
		{
			Employee_EmailID: 'emp3@test.com',
			Employee_Name: 'Employee 4',
			Secret_Child_EmailID: 'emp3@test.com',
			Secret_Child_Name: 'Employee 4',
		},

		{
			Employee_EmailID: 'emp3@test.com',
			Employee_Name: 'Employee 3',
			Secret_Child_EmailID: 'emp1@test.com',
			Secret_Child_Name: 'Employee 1',
		},
	];

	beforeEach(() => {
		santaAssigner = new SantaAssigner();
		jest.clearAllMocks();
	});

	describe('assignData', () => {
		it('should assign secret santas without previous year data', () => {
			const result = santaAssigner.assignData(mockEmployees);

			// Check all employees are assigned
			expect(result.length).toBe(mockEmployees.length);

			// Check no one is assigned to themselves
			result.forEach((assignment) => {
				expect(assignment.Employee_EmailID).not.toBe(
					assignment.Secret_Child_EmailID,
				);
			});

			// Check all assignments are unique
			const assignedTo = new Set(
				result.map((r) => r.Secret_Child_EmailID),
			);
			expect(assignedTo.size).toBe(mockEmployees.length);
		});

		it('should respect previous year assignments', () => {
			const result = santaAssigner.assignData(
				mockEmployees,
				mockPreviousAssignments,
			);

			// Check no one got the same person as last year
			result.forEach((assignment) => {
				const previousAssignment = mockPreviousAssignments.find(
					(pa) => pa.Employee_EmailID === assignment.Employee_EmailID,
				);
				if (previousAssignment) {
					expect(assignment.Secret_Child_EmailID).not.toBe(
						previousAssignment.Secret_Child_EmailID,
					);
				}
			});
		});

		it('should throw error when no valid assignment is possible', () => {
			// Create a situation where valid assignment is impossible
			const twoEmployees = mockEmployees.slice(0, 2);
			const previousAssignment = [
				{
					...twoEmployees[0],
					Secret_Child_EmailID: twoEmployees[1].Employee_EmailID,
					Secret_Child_Name: twoEmployees[1].Employee_Name,
				},
			];

			expect(() => {
				santaAssigner.assignData(twoEmployees, previousAssignment);
			}).toThrow('No valid assignment found');
		});
	});

	// Test private shuffle method through its effects
	describe('shuffle', () => {
		it('should maintain the same length after shuffling', () => {
			const originalLength = mockEmployees.length;
			// Access private method through any
			const shuffled = (santaAssigner as any).shuffle([...mockEmployees]);
			expect(shuffled.length).toBe(originalLength);
		});

		it('should contain all original elements after shuffling', () => {
			const original = [...mockEmployees];
			const shuffled = (santaAssigner as any).shuffle([...mockEmployees]);

			expect(shuffled).toEqual(expect.arrayContaining(original));
			expect(original).toEqual(expect.arrayContaining(shuffled));
		});

		it('should potentially change the order of elements', () => {
			let differentOrderFound = false;
			for (let i = 0; i < 10; i++) {
				const shuffled = (santaAssigner as any).shuffle([
					...mockEmployees,
				]);
				if (
					!shuffled.every(
						(emp: EmployeeDataTypes, index: number) =>
							emp === mockEmployees[index],
					)
				) {
					differentOrderFound = true;
					break;
				}
			}
			expect(differentOrderFound).toBeTruthy();
		});
	});
});
