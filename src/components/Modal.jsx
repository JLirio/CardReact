export default function Modal({
  title,
  visible,
  message,
  buttonMessage,
  closeModal
}) {

  return (
    <>
      <div className={visible ? `absolute flex justify-center items-center h-full w-full bg-[#000000b0] z-[99999]` : 'hidden'}>
        <div className="border bg-white shadow-md w-[40%] p-12 rounded-md">
          <h1 className="text-2xl font-semibold">
            {title}
          </h1>
          {
            message ? (
              <p
                className="text-xl py-2"
              >
                {message}
              </p>
            ) : ''
          }
          <button
            className="p-2 py-2 bg-purple-700 w-full text-white my-2 rounded-md shadow-sm cursor-pointer text-lg font-semibold"
            onClick={() => closeModal(visible)}
          >
            {buttonMessage || `Ok`}
          </button>
        </div>
      </div>
    </>
  )
}
