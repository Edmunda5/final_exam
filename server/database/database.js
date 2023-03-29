const db_connection = require("./connection.js");
const verification = require("../verification.js");

const convertUnixToDate = (unix) => {
  const date = new Date(parseInt(unix) * 1000);
  let f = {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Vilnius",
  };
  const retval = new Intl.DateTimeFormat("lt-LT", f).format(date);
  return retval;
};

const database = {
  verifyUser: (username, password, res) => {
    db_connection.query(
      `SELECT * FROM admin_users WHERE username = '${username}'`,
      (err, result) => {
        if (err) {
          res.status(401);
        } else {
          if (result.length > 0) {
            if (result[0].password === password) {
              res.status(200);
            } else {
              res.status(401);
            }
          } else {
            res.status(401);
          }
        }
        const token = verification.signInToken(username);
        res.cookie("token", token, { httpOnly: true });

        res.send({ message: "success" });
      }
    );
  },
  fetchEvents: (eventId) => {
    return new Promise((resolve, reject) => {
      db_connection.query(
        `SELECT events.id, events.name, events.date, COUNT(members.id) AS attendees
        FROM events
        LEFT JOIN members ON events.id = members.event
        GROUP BY events.id`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              result.map((event) => {
                return {
                  id: event.id,
                  name: event.name,
                  date: convertUnixToDate(event.date),
                  attendees: event.attendees,
                };
              })
            );
          }
        }
      );
    });
  },
  fetchMembers: (eventId) => {
    return new Promise((resolve, reject) => {
      db_connection.query(
        `SELECT members.*, events.name AS eventName 
        FROM members
        JOIN events ON members.event = events.id
        ${eventId ? `WHERE members.event = ${eventId}` : ""};`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.map((member) => {
              return {
                id: member.id,
                firstName: member.firstname,
                lastName: member.lastname,
                email: member.email,
                event: parseInt(member.event),
                eventName: member.eventName,
                dobUnix: member.dob,
                dob: convertUnixToDate(member.dob),
              }; 
            }));
          }
        }
      );
    });
  },
  registerMember: (member) => {
    return new Promise((resolve, reject) => {
      if (
        !member.firstName ||
        !member.lastName ||
        !member.email ||
        !member.event ||
        !member.dob
      ) {
        reject("Neužpildyti visi laukai");
      }
      db_connection.query(
        `INSERT INTO members (firstname, lastname, email, event, dob) VALUES ('${
          member.firstName
        }', '${member.lastName}', '${member.email}', '${
          member.event
        }', '${member.dob}')`,
        (err, result) => {
          if (err) {
            reject("Klaida registruojant vartotoją");
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  deleteMember: (memberId) => {
    return new Promise((resolve, reject) => {
      db_connection.query(
        `DELETE FROM members WHERE id = ${memberId}`,
        (err, result) => {
          if (err) {
            reject("Klaida šalinant vartotoją");
          } else {
            resolve();
          }
        }
      );
    });
  },
  updateMember: (member) => {
    return new Promise((resolve, reject) => {
      db_connection.query(
        `UPDATE members SET firstname = '${member.firstName}', lastname = '${member.lastName}', email = '${member.email}', event = '${member.event}', dob = '${member.dob}' WHERE id = ${member.id}`,
        (err, result) => {
          if (err) {
            reject("Klaida atnaujinant vartotoją");
          } else {
            resolve();
          }
        }
      );
    });
  }
};

module.exports = database;
