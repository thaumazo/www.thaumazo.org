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
          className="inline-flex h-8 w-8 items-center justify-center rounded bg-gray-800 dark:bg-gray-200"
        >
          <IoLogoLinkedin className="h-4 w-4 text-white dark:text-black" />
        </a>
      )}
    </div>
  );
}
