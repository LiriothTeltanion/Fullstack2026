import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
export const GlobalStyle = createGlobalStyle`
*{box-sizing:border-box}body{margin:0;background:#fff;color:#263c36;font:15px/1.6 "DM Sans",system-ui,sans-serif}button,input,select{font:inherit}button,a{cursor:pointer}a{color:inherit}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #bb6a3d;outline-offset:4px}h1,h2,h3,p{margin-top:0}h1,h2{font-family:"Instrument Serif",Georgia,serif;font-weight:400}h1{font-size:clamp(2.3rem,5vw,4rem);line-height:1.1}h2{font-size:2rem}button:disabled{opacity:.6;cursor:wait}img{max-width:100%}
`;
export const Header = styled.header`
  border-bottom: 1px solid #e6ece8;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px max(5vw, 20px);
  flex-wrap: wrap;
`;
export const Brand = styled(Link)`
  font:
    2.1rem "Instrument Serif",
    Georgia,
    serif;
  text-decoration: none;
  letter-spacing: -0.05em;
`;
export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;
export const Main = styled.main`
  max-width: 1180px;
  min-height: 70vh;
  margin: auto;
  padding: 40px 24px 70px;
  @media (max-width: 500px) {
    padding: 28px 18px 45px;
  }
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
`;
export const Card = styled.article`
  border: 1px solid #e4ebe5;
  border-radius: 4px;
  background: white;
  box-shadow: 0 6px 18px #273c3610;
  overflow: hidden;
`;
export const CardBody = styled.div`
  padding: 20px;
`;
export const Row = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;
export const Button = styled.button`
  border: 1px solid #244f3e;
  background: ${p => (p.$secondary ? "#fff" : "#244f3e")};
  color: ${p => (p.$secondary ? "#244f3e" : "#fff")};
  padding: 10px 18px;
  border-radius: 3px;
  font-weight: 600;
`;
export const Action = styled(Link)`
  display: inline-block;
  text-decoration: none;
  border: 1px solid #244f3e;
  background: #244f3e;
  color: white;
  padding: 10px 18px;
  border-radius: 3px;
  font-weight: 600;
`;
export const Muted = styled.p`
  color: #667a70;
`;
export const Strip = styled.div`
  background: #eef4ef;
  padding: 8px 20px;
  text-align: center;
  font-size: 0.8rem;
  color: #4a6354;
`;
export const Cover = styled.div`
  aspect-ratio: 3/4;
  max-width: 185px;
  width: 100%;
  margin: 24px auto 0;
  background: ${p => p.$tone || "#315f53"};
  color: #fff;
  padding: 22px 18px;
  border-left: 8px solid #0002;
  box-shadow: 6px 8px 12px #0002;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font:
    1.8rem/1.05 "Instrument Serif",
    Georgia,
    serif;
  small {
    font:
      12px/1.4 "DM Sans",
      sans-serif;
    letter-spacing: 0.08em;
  }
`;
export const Detail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 48px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
export const Purchase = styled.aside`
  padding: 26px;
  background: #f4f6f2;
  border: 1px solid #e4ebe5;
  align-self: start;
`;
export const TableWrap = styled.div`
  overflow-x: auto;
  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 540px;
  }
  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #dce5dc;
    vertical-align: top;
  }
  th {
    background: #f3f6f1;
  }
  input {
    width: 68px;
    padding: 7px;
    border: 1px solid #b5c8ba;
  }
`;
export const Form = styled.form`
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  background: #f5f7f2;
  display: grid;
  gap: 18px;
  label {
    display: grid;
    gap: 6px;
  }
  input {
    width: 100%;
    padding: 11px;
    border: 1px solid #b5c8ba;
    border-radius: 3px;
    background: white;
  }
`;
export const Footer = styled.footer`
  text-align: center;
  padding: 28px;
  border-top: 1px solid #e6ece8;
  color: #738076;
  font-size: 0.82rem;
`;
