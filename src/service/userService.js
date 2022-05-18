const {
  verifyPassword,
  hashPassword
} = require('../core/password');
const {
  generateJWT,
  verifyJWT
} = require('../core/jwt');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');
const userRepository = require('../repository/userRepos');
const sendMail = require('../sendMail');



const makeExposedUser = ({
  emailAdres,
  userID,
  voornaam,
  achternaam,
  // adres,
  telefoonnummer,
  role
}) => ({
  emailAdres,
  userID,
  voornaam,
  achternaam,
  // adres,
  telefoonnummer,
  role
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  
  if (!user) {
    console.log("unmatching authentication")
    throw ServiceError.unauthorized('The given email and password do not match');
  }
  const passwordValid = await verifyPassword(password, user.wachtwoordhash);
  
  if (!passwordValid) {
    console.log("ww kapot")
    throw ServiceError.forbidden('The given email and password do not match');
  }

  return await makeLoginData(user);
};


const register = async ({
  emailAdres,
  voornaam,
  achternaam,
  // geboorteDatum,
  // adres,
  telefoonnummer,
  wachtwoord,
}) => {
  const passwordHash = await hashPassword(wachtwoord);
  const user = await userRepository.create({
    emailAdres,
    voornaam,
    achternaam,
    // geboorteDatum,
    // adres,
    telefoonnummer,
    passwordHash,
    roles: [Role.USER],
  });

  sendMail.sendMailRegister(emailAdres, voornaam);
  return await makeLoginData(user);
};


const getAll = async (
  limit = 100,
  offset = 0,
) => {  
  const data = await userRepository.getAllUsers({
    limit,
    offset
  });
  const totalCount = await userRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

const getById = async (userID) => {
  const user = await userRepository.findById(userID);

  if (!user) {
    throw ServiceError.notFound(`No user with id ${userID} exists`, {
      userID
    });
  }
  return user;
};

const updateById = (id, {
  voornaam,
  achternaam,  
  telefoonnummer,
  // geboorteDatum,
  // adres,
  emailAdres
}) => {
  return userRepository.updateById(id, {
  voornaam,
  achternaam, 
  telefoonnummer,
  // geboorteDatum,
   // adres,
  emailAdres
  });
};

const wijzigRechtenById = ({rol, userID}) => {
  return userRepository.updateRolByID({userID, rol});
};

const deleteById = async (id) => {
  const deleted = await userRepository.deleteById(id);

  if (!deleted) {
    throw ServiceError.notFound(`No user with id ${id} exists`, {
      id
    });
  }
};

const checkAndParseSession = async (authHeader) => {
	if (!authHeader) {
    console.log("no header")
		throw new Error('You need to be signed in');
	}
  
	if (!authHeader.startsWith('Bearer ')) {
    console.log("no valid token")
		throw new Error('Invalid authentication token');
	}

	const authToken = authHeader.substr(7);
	try {
		const {
			roles, userId,
		} = await verifyJWT(authToken);

		return {
			userId,
			roles,
			authToken,
		};
	} catch (error) {
		throw new Error(error.message);
	}
};

const checkRole = (roles, userRole) => {
  let hasPermission = false;

  if (typeof roles === 'string') {
    hasPermission = (roles===userRole?true:false);
  }
  else if (Array.isArray(roles))
  {
    for (let i = 0; i < roles.length; i++) {
      if (userRole===roles[i]) {

        hasPermission = true;
      }
    }
  }
  

  if (!hasPermission) {
    console.log("Forbidden route for role \"" + userRole +"\"")
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
};

module.exports = {
  login,
  register,
  getAll,
  getById,
  updateById,
  wijzigRechtenById,
  deleteById,
  checkAndParseSession,
  checkRole,
};