import { getElementById } from "../utils/document";

export type Modal = ReturnType<typeof create>;

export const Modal = {
  create,
};

function create(props: {
  id: string;
  header: string;
  content: string;
  footer: string;
  uiLayer: HTMLDivElement;
}) {
  props.uiLayer.insertAdjacentHTML(
    "beforeend",
    `
      <div id="${props.id}" class="modal-overlay hidden">
        <div class="modal">          
          <div class="modal-header">
            ${props.header}
          </div>
          <div class="modal-content">
            ${props.content}
          </div>
          <div class="modal-footer modal-footer-buttons">
            ${props.footer}
          </div>
        </div>
      </div>
    `,
  );

  const modal = getElementById(props.id);

  const isVisible = () => !modal.classList.contains("hidden");

  const show = async () => {
    modal.classList.remove("hidden");
  };

  const hide = () => {
    modal.classList.add("hidden");
  };

  return {
    show,
    hide,
    isVisible,
  };
}
