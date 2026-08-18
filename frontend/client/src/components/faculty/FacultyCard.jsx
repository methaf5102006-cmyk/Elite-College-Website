const FacultyCard = ({ member }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink/10 overflow-hidden hover:shadow-md transition">
      <div className="aspect-square bg-parchment flex items-center justify-center overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-ink/10 flex items-center justify-center">
            <span className="font-display text-2xl text-ink/40">
              {member.name?.charAt(0) || '?'}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-body font-semibold text-ink text-lg">{member.name}</h3>
        <p className="font-body text-gold-dark text-sm">{member.designation}</p>
        {member.qualification && (
          <p className="font-body text-slate text-sm mt-1">{member.qualification}</p>
        )}
        {member.department?.name && (
          <p className="font-body text-xs text-slate/80 mt-2">{member.department.name}</p>
        )}
        {member.email && (
          <p className="font-body text-xs text-ink underline mt-2">
            {member.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default FacultyCard;