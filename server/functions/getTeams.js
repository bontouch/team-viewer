const getHiBobEmployees = require("./getHiBobEmployees");
const getHiBobWhosOutToday = require("./getHiBobWhosOutToday");
const getSlackMembersList = require("./getSlackMembersList");

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
        slackLink: curr.slackLink,
        hiBobLink: curr.hiBobLink,
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
  const allSlackMembers = await getSlackMembersList();

  const employeesEmailList = employees.map((employee) => employee.email);

  const employeeSlackMembersEmailAndLink = allSlackMembers
    .filter((member) => employeesEmailList.includes(member.profile.email))
    .map((employeeSlackItem) => ({
      slackLink: `slack://user?team=${employeeSlackItem.team_id}&id=${employeeSlackItem.id}`,
      email: employeeSlackItem.profile.email,
    }));

  const employeesEnriched = employees.map((employee) =>
    Object.assign({}, employee, {
      leavePolicy: whosOut.find(
        (employeeOnLeave) => employeeOnLeave.employeeId === employee.id
      )?.policyTypeDisplayName,
      slackLink: employeeSlackMembersEmailAndLink.find(
        (employeeSlackItem) => employeeSlackItem.email === employee.email
      )?.slackLink,
      hiBobLink: `https://app.hibob.com/employee-profile/${employee.id}`,
    })
  );
  return groupEmployeesByProductTeam(employeesEnriched);
};

module.exports = getTeams;
