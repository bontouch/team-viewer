const getHiBobEmployees = require("./getHiBobEmployees");

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
  return groupEmployeesByProductTeam(employees);
};

module.exports = getTeams;
