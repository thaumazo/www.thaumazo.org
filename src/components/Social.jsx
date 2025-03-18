import {
  // IoLogoFacebook,
  IoLogoLinkedin,
  // IoLogoPinterest,
  // IoLogoTwitter,
} from "react-icons/io5";

export default function Social({ linkedin = null }) {
  if (!linkedin) {
    return;
  }
  return (
    <div className="inline-flex">
      {linkedin && (
        <a
          href={linkedin}
          className="inline-flex justify-center items-center w-8 h-8 rounded bg-gray-800 dark:bg-gray-200"
        >
          <IoLogoLinkedin className="w-4 h-4 text-white dark:text-black" />
        </a>
      )}
    </div>
  );
}
