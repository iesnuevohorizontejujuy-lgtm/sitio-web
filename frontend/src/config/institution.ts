export const institution = {
  name: "Instituto de Educación Superior Nuevo Horizonte",
  shortName: "IES Nuevo Horizonte",
  city: "San Salvador de Jujuy",
  province: "Jujuy",
  address:
    "Manuel Castellano 3323 esq. Ildefonso M. de la Paz, B° 47 Hectáreas, Alto Comedero",
  postalCode: "4600",
  primaryPhone: {
    label: "+54 9 388 682-5633",
    whatsapp: "5493886825633",
  },
  phones: [
    { label: "+54 9 388 682-5633", whatsapp: "5493886825633" },
    { label: "+54 9 388 464-0637", whatsapp: "5493884640637" },
    { label: "+54 9 388 464-0570", whatsapp: "5493884640570" },
    { label: "+54 9 388 464-0651", whatsapp: "5493884640651" },
  ],
  social: {
    facebook:
      "https://www.facebook.com/InstitutoDeEducacionSuperiorNuevoHorizonte",
    instagram: "https://www.instagram.com/iesnuevohorizonte/",
  },
} as const;

export const whatsappHref = (message: string) =>
  `https://wa.me/${institution.primaryPhone.whatsapp}?text=${encodeURIComponent(message)}`;
