/**
 * Gets the initials from a given full name
 *
 * @param {String} string - the full name
 * @returns {String} the initials of the full name
 */
export const getInitials = (string: string, entity?: 'project'): string => {
  const initials = string.split(' ');

  if (entity === 'project') {
    return `${initials[0].charAt(0)}`;
  }

  return `${initials[0].charAt(0)}${initials[1].charAt(0)}`;
};
