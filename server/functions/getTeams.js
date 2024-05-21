const getHiBobEmployees = require("./getHiBobEmployees");
const getHiBobWhosOutToday = require("./getHiBobWhosOutToday");

const groupEmployeesByProductTeam = (array) => {
  return array.reduce((acc, curr) => {
    if (curr.work.customColumns["Product Team"] === "")
      curr.work.customColumns["Product Team"] = "Other";
    const productTeams = curr.work.customColumns["Product Team"].split(",");
    productTeams.forEach((productTeam) => {
      const employee = {
        fullName: curr.fullName,
        department: curr.work.department,
        id: curr.id,
        title: curr.work.title === "-" ? undefined : curr.work.title,
        leavePolicy: curr.leavePolicy,
      };
      productTeam in acc
        ? acc[productTeam].push(employee)
        : (acc[productTeam] = [employee]);
    });
    return acc;
  }, {});
};

const getTeams = async () => {
  const employees = await getHiBobEmployees();
  const whosOut = await getHiBobWhosOutToday();

  const employeesWithLeavePolicy = employees.map((employee) =>
    Object.assign({}, employee, {
      leavePolicy: whosOut.find(
        (employeeOnLeave) => employeeOnLeave.employeeId === employee.id
      )?.policyTypeDisplayName,
    })
  );

  return groupEmployeesByProductTeam(employeesWithLeavePolicy);
};

module.exports = getTeams;
