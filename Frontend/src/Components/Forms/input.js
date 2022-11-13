function InputModel(props) {
    const { label, onChange, error, name, value, ...otherProps } = props;
  
    return (
      <div>
        <label>
          <span>{label}</span>
          <input value={value} onChange={onChange} name={name} {...otherProps} />
        </label>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </div>
    );
  }
  export default InputModel;