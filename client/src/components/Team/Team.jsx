import { memo, useMemo, useState } from 'react';
import { compareArrays } from '../../helpers/utils';
import styles from './Team.module.scss';
import EmployeeAvatarAndName from '../EmployeeAvatarAndName/EmployeeAvatarAndName';
import Slider from '../Slider/Slider';
import useAvatarsQuery from '../../helpers/queries/useAvatarsQuery';
import { useEmployeeToScrollToStore } from '../../pages/Teams/Teams';

const departmentsByWeight = [
    'Management',
    'Product Leads',
    'Team Leads',
    'Analytics & Governance',
    'QA',
    'Design',
    'Android',
    'iOS',
    'Web',
    'Cloud'
];

const Team = ({ teamName, employees }) => {
    const { data: avatars, isLoading: isLoadingAvatars } = useAvatarsQuery();
    const [orderByDepartment, setOrderByDepartment] = useState(false);
    const setShouldScroll = useEmployeeToScrollToStore((state) => state.setShouldScroll);

    const employeesByDepartment = useMemo(
        () =>
            employees.reduce((acc, curr) => {
                const department = curr.department;
                department in acc ? acc[department].push(curr) : (acc[department] = [curr]);
                return acc;
            }, {}),
        [employees]
    );
    const departmentKeysOrdered = useMemo(
        () => [
            ...departmentsByWeight,
            ...employees
                .map((employee) => employee.department)
                .filter((department) => !departmentsByWeight.includes(department))
                .sort((departmentA, departmentB) =>
                    departmentA.toLowerCase().localeCompare(departmentB.toLowerCase())
                )
                .filter((element, index, array) => array.indexOf(element) === index)
        ],
        [employees]
    );

    const employeesArrayOrderedByDepartmentWeight = useMemo(() => {
        return departmentKeysOrdered
            .map((departmentKey) => {
                if (!employeesByDepartment[departmentKey]) return undefined;
                return employeesByDepartment[departmentKey].map((employee) => employee);
            })
            .filter(Boolean)
            .flat();
    }, [employees]);

    const employeeList = orderByDepartment ? employeesArrayOrderedByDepartmentWeight : employees;

    return (
        <div className={styles.container}>
            <div className={styles.border}>
                <div className={styles.wrapper}>
                    <h2 className={styles.title}>{teamName}</h2>
                    {Object.keys(employeesByDepartment).length > 1 ? (
                        <Slider
                            callback={() => {
                                setShouldScroll(false);
                                setOrderByDepartment(!orderByDepartment);
                            }}
                        />
                    ) : null}
                </div>

                <ul className={styles['employee-list-container']}>
                    {employeeList.map((employee) => (
                        <EmployeeAvatarAndName
                            key={employee.id}
                            fullName={employee.fullName}
                            id={employee.id}
                            url={isLoadingAvatars ? null : avatars[employee.id]}
                            isLoading={isLoadingAvatars}
                            department={employee.department}
                            role={employee.department}
                            teamName={teamName}
                            title={employee.title}
                            leavePolicy={employee.leavePolicy}
                            slackLink={employee.slackLink}
                            hiBobLink={employee.hiBobLink}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default memo(Team, (prevProps, nextProps) =>
    compareArrays(prevProps.employees, nextProps.employees)
);
