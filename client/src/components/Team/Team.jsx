import { memo, useCallback, useMemo, useState } from 'react'
import { compareArrays } from '../../helpers/utils'
import styles from './Team.module.scss'
import EmployeeAvatarAndName from '../EmployeeAvatarAndName/EmployeeAvatarAndName'
import useAvatars from '../../helpers/useAvatars'

const departmentsByWeight = [
    'Product Leads',
    'Team Leads',
    'Analytics & Governance',
    'QA',
    'Design',
    'Android',
    'iOS',
    'Web',
    'Cloud',
]

const employeesByDepartment = (employees) =>
    employees.reduce((acc, curr) => {
        const department = curr.department
        department in acc
            ? acc[department].push(curr)
            : (acc[department] = [curr])
        return acc
    }, {})

const Team = ({ teamName, employees }) => {
    const { data: avatars, isLoading: isLoadingAvatars } = useAvatars()
    const [splitByDepartment, setSplitByDepartment] = useState(false)
    const employeesByDepartment = useMemo(
        () =>
            employees.reduce((acc, curr) => {
                const department = curr.department
                department in acc
                    ? acc[department].push(curr)
                    : (acc[department] = [curr])
                return acc
            }, {}),
        [employees]
    )
    const departmentKeysOrdered = useMemo(
        () => [
            ...departmentsByWeight,
            ...employees
                .map((employee) => employee.department)
                .filter(
                    (department) => !departmentsByWeight.includes(department)
                )
                .sort(function (departmentA, departmentB) {
                    return departmentA
                        .toLowerCase()
                        .localeCompare(departmentB.toLowerCase())
                })
                .filter(
                    (element, index, array) => array.indexOf(element) === index
                ),
        ],
        [employees]
    )
    return (
        <div className={styles.container}>
            <div className={styles.border}>
                <h2 className={styles.title}>
                    {teamName}{' '}
                    {Object.keys(employeesByDepartment).length > 1 ? (
                        <button
                            className={styles.split}
                            onClick={() =>
                                setSplitByDepartment(!splitByDepartment)
                            }
                        >
                            {splitByDepartment
                                ? 'hide departments'
                                : 'show departments'}
                        </button>
                    ) : null}
                </h2>
                {splitByDepartment ? (
                    departmentKeysOrdered.map((departmentKey) => {
                        if (!employeesByDepartment[departmentKey]) return null
                        return (
                            <>
                                <h3 className={styles.department}>
                                    {departmentKey}
                                </h3>
                                <ul
                                    className={
                                        styles['employee-list-container']
                                    }
                                >
                                    {employeesByDepartment[departmentKey].map(
                                        (employee) => (
                                            <li
                                                className={
                                                    styles['employee-item']
                                                }
                                                key={employee.id}
                                            >
                                                <EmployeeAvatarAndName
                                                    fullName={employee.fullName}
                                                    id={employee.id}
                                                    url={
                                                        isLoadingAvatars
                                                            ? null
                                                            : avatars[
                                                                  employee.id
                                                              ]
                                                    }
                                                    isLoading={isLoadingAvatars}
                                                />
                                            </li>
                                        )
                                    )}
                                </ul>
                            </>
                        )
                    })
                ) : (
                    <ul className={styles['employee-list-container']}>
                        {employees.map((employee) => (
                            <li
                                className={styles['employee-item']}
                                key={employee.id}
                            >
                                <EmployeeAvatarAndName
                                    fullName={employee.fullName}
                                    id={employee.id}
                                    url={
                                        isLoadingAvatars
                                            ? null
                                            : avatars[employee.id]
                                    }
                                    isLoading={isLoadingAvatars}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default memo(Team, (prevProps, nextProps) =>
    compareArrays(prevProps.employees, nextProps.employees)
)
