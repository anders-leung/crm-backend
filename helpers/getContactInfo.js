const getValue = (info, type) => {
  if (type === 'email') {
    return info.address;
  }
  const { number, extension } = info;
  return extension ? `${number} ext. ${extension}` : number;
};

const getContactInfo = (client = {}, which = 'Default', type = 'email') => {
  const { contacts } = client;
  let result;

  if (!contacts || contacts.length === 0) return '';

  contacts.forEach((contact) => {
    const emailsOrPhones = contact[`${type}s`];
    emailsOrPhones.forEach((emailOrPhone) => {
      const infoWhich = emailOrPhone[`${type}Type`];
      const value = getValue(emailOrPhone, type);
      if (!infoWhich) return;
      if (!result && !infoWhich.includes('Do Not Send')) result = value;
      if (infoWhich.includes(which)) result = value;
    });
  });

  return result;
};

module.exports = getContactInfo;
